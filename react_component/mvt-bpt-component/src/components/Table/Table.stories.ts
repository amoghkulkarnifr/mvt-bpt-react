import type { Meta, StoryObj } from '@storybook/react';

import BasicTable from './Table';

import Papa from 'papaparse';

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
      description: 'Header of the table'
    },
    data: {
      description: 'Rows of the table'
    }
  },

  args: {
    header: ['Column 1', 'Column 2', 'Column 3'],
    data: [
      ['Value 1_1', 'Value 1_2', 'Value 1_3'],
      ['Value 2_1', 'Value 2_2', 'Value 2_3'],
      ['Value 3_1', 'Value 3_2', 'Value 3_3'],
    ],
    minWidth: 300,
  }
} satisfies Meta<typeof BasicTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default table (with default args)
 */
export const Default: Story = {};

/**
 * Wide table
 */
export const Wide: Story = {
  args: {
    minWidth: 600
  }
};

/**
 * Table with data in csv format
 */
const adani_data = `Date,Open,Low,High,Close\n
2020-01-15,214.5,212.5,218.0,216.6\n
2020-01-16,217.7,217.0,222.5,220.0\n
2020-01-17,216.0,213.7,229.25,228.4\n
2020-01-20,229.55,224.15,232.25,226.55\n
2020-01-21,224.35,220.5,227.0,224.25\n
2020-01-22,224.8,221.15,228.0,225.9\n
2020-01-23,226.0,225.75,231.2,229.6\n
2020-01-24,225.5,219.0,232.4,229.75`;

// Parse the CSV data
let parsed_csv_header: string[] = [];
let parsed_csv_data: string[][] = [];
Papa.parse(adani_data, {
  header: true,
  skipEmptyLines: true,
	complete: function(results) {
		parsed_csv_header = results.meta.fields!;
    results.data.map((d) => {
      parsed_csv_data.push(Object.values(d!));
    });
  }
});
export const Static_CSV: Story = {
  args: {
    header: parsed_csv_header,
    data: parsed_csv_data
  }
}

/**
 * Table with data from CSV stored in /assets
 */
export const File_CSV: Story = {
  args: {
    file: true,
    filename: 'ADANIENT',
    header: [],
    data: []
  }
}