import {GestureOptions} from '../../types/common';
import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async (options: GestureOptions): Promise<void> => {
  const newUrl: string|null = (options && options.href) || null;
  await chromeTabs.createActiveRight(newUrl);
};
