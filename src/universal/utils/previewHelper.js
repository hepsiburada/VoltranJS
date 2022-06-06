import Preview from '../components/Preview';
import { isPreview } from '../service/RenderService';

const previewPages = require('__V_PREVIEW__');

const getPreviewLayout = query => {
  if (isPreview(query)) {
    return query?.preview;
  }

  return '';
};

export const getPreviewFile = query => {
  const layoutName = getPreviewLayout(query);
  const { previewLayouts = {} } = previewPages?.default || {};
  let PreviewFile = Preview;

  if (previewLayouts[layoutName]) {
    PreviewFile = previewLayouts[layoutName];
  } else if (previewLayouts.default) {
    PreviewFile = previewLayouts.default;
  }

  return PreviewFile;
};
