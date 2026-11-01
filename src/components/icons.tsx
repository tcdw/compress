import arrowRight from '@iconify-icons/fa7-solid/arrow-right';
import cat from '@iconify-icons/fa7-solid/cat';
import circleExclamation from '@iconify-icons/fa7-solid/circle-exclamation';
import download from '@iconify-icons/fa7-solid/download';
import folderOpen from '@iconify-icons/fa7-solid/folder-open';
import moon from '@iconify-icons/fa7-solid/moon';
import sun from '@iconify-icons/fa7-solid/sun';
import trashCan from '@iconify-icons/fa7-solid/trash-can';
import upload from '@iconify-icons/fa7-solid/upload';
import xmark from '@iconify-icons/fa7-solid/xmark';
import {
  type BuiltinIconProps,
  Icon,
  type IconData,
} from '@tuuject/koi-react/icons';

// Koi's icons are Font Awesome Free Solid, drawn in currentColor. Wrapping the Iconify data keeps the
// icon sites short and gives every glyph the same prop surface.
function icon(data: IconData) {
  return (props: BuiltinIconProps) => <Icon icon={data} {...props} />;
}

export const CatIcon = icon(cat);
export const UploadIcon = icon(upload);
export const CloseIcon = icon(xmark);
export const DownloadIcon = icon(download);
export const FolderIcon = icon(folderOpen);
export const TrashIcon = icon(trashCan);
export const MoonIcon = icon(moon);
export const SunIcon = icon(sun);
export const ErrorIcon = icon(circleExclamation);
export const ArrowRightIcon = icon(arrowRight);
