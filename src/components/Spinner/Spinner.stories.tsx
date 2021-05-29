import { Story, Meta } from '@storybook/react'

import { Spinner } from './Spinner'

export default {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'fullscreen'
  }
} as Meta

export const Default: Story = () => (<div style={{ minHeight: '100vh' }}>
  <Spinner />
</div>)