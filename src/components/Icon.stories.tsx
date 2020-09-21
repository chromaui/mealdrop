import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Icon } from './Icon'

export default {
  title: 'Icon',
  component: Icon,
  argTypes: {
    name: {
      control: {
        type: 'select',
        options: ['arrow-forward', 'arrow-backward'],
      },
    },
    size: {
      control: {
        type: 'range',
      },
    },
  },
} as Meta

const Template: Story = (args) => <Icon {...args} />

export const Default = Template.bind({})
Default.args = {
  name: 'cart',
  size: 25,
}