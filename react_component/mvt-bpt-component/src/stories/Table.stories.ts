import type { Meta, StoryObj } from '@storybook/react';

import BasicTable from '../components/Table/Table';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Example/BasicTable',
  component: BasicTable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],

  argTypes: {
    minWidth: {
      control: 'number',
      description: 'Minimum width of a table column'
    },
    header: {
      control: 'object',
      description: 'Header of the table'
    },
    rows: {
      control: 'object',
      description: 'Rows of the table'
    }
  },

  args: {
    header: ['Column 1', 'Column 2', 'Column 3'],
    rows: [
      ['Value 1_1', 'Value 1_2', 'Value 1_3'],
      ['Value 2_1', 'Value 2_2', 'Value 2_3'],
      ['Value 3_1', 'Value 3_2', 'Value 3_3'],
    ],
    minWidth: 300,
  }
} satisfies Meta<typeof BasicTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Wide: Story = {
  args: {
    minWidth: 600
  }
};
