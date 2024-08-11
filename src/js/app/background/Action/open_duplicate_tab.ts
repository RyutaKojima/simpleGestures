import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async (): Promise<void> => {
  await chromeTabs.duplicate();
};
