// Replace react with one of the supported Storybook frameworks (react, vue3)
import path from 'path'

import type { Meta, StoryFn } from '@storybook/react'
import { describe, expect, test } from 'vitest'
// Replace your-testing-library with one of the supported testing libraries (e.g., react, vue)
import { render } from '@testing-library/react'
// Adjust the import based on the supported framework or Storybook's testing libraries (e.g., react, testing-vue3)
import { composeStories } from '@storybook/react'

type StoryFile = {
  default: Meta
  [name: string]: StoryFn | Meta
}

const compose = (entry: StoryFile): ReturnType<typeof composeStories<StoryFile>> => {
  try {
    return composeStories(entry)
  } catch (e) {
    throw new Error(
      `There was an issue composing stories for the module: ${JSON.stringify(entry)}, ${e}`
    )
  }
}

function getAllStoryFiles() {
  // Place the glob you want to match your story files
  const storyFiles = Object.entries(
    import.meta.glob<StoryFile>('./**/*.(stories|story).@(js|jsx|mjs|ts|tsx)', {
      eager: true,
    })
  )

  return storyFiles.map(([filePath, storyFile]) => {
    const storyDir = path.dirname(filePath)
    const componentName = path.basename(filePath).replace(/\.(stories|story)\.[^/.]+$/, '')
    return { filePath, storyFile, componentName, storyDir }
  })
}

// Recreate similar options to storyshots. Place your configuration below
const options = {
  suite: 'Storybook Tests',
  storyKindRegex: /^.*?DontTest$/,
  storyNameRegex: /UNSET/,
  snapshotsDirName: '__snapshots__',
  snapshotExtension: '.storyshot',
}

describe(options.suite, () => {
  getAllStoryFiles().forEach(({ storyFile, componentName, storyDir }) => {
    const meta = storyFile.default
    const title = meta.title || componentName

    if (options.storyKindRegex.test(title) || meta.parameters?.storyshots?.disable) {
      // Skip component tests if they are disabled
      return
    }

    describe(title, () => {
      const stories = Object.entries(compose(storyFile))
        .map(([name, story]) => ({ name, story }))
        .filter(({ name, story }) => {
          // Implements a filtering mechanism to avoid running stories that are disabled via parameters or that match a specific regex mirroring the default behavior of Storyshots.
          return !options.storyNameRegex?.test(name) && !story.parameters.storyshots?.disable
        })

      if (stories.length <= 0) {
        throw new Error(
          `No stories found for this module: ${title}. Make sure there is at least one valid story for this module, without a disable parameter, or add parameters.storyshots.disable in the default export of this file.`
        )
      }

      stories.forEach(({ name, story }) => {
        // Instead of not running the test, you can create logic to skip it, flagging it accordingly in the test results.
        const testFn = story.parameters.storyshots?.skip ? test.skip : test

        testFn(name, async () => {
          await story.load()
          const mounted = render(story())
          await story.play?.()
          // expect(mounted.container).toMatchSnapshot()
        })
      })
    })
  })
})
