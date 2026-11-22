/** Place the portal next to the sidebar, not on top of the hovered row. */
export interface ModulePickerPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
}

export interface ModulePickerGeometry {
  anchorTop: number;
  anchorRight: number;
  sidebarRight: number;
  viewportWidth: number;
  viewportHeight: number;
  itemCount: number;
  /** Bottom of the sticky navigation in viewport pixels. */
  obscuredTop?: number;
}

export function calculateModulePickerPosition(geometry: ModulePickerGeometry): ModulePickerPosition {
  const { anchorTop, anchorRight, sidebarRight, viewportWidth, viewportHeight, itemCount,
    obscuredTop = 0 } = geometry;
  const margin = 12;
  const safeTop = Math.max(margin, obscuredTop + margin);
  const viewportHeightAvailable = Math.max(0, viewportHeight - safeTop - margin);
  // The header and list have different fixed padding; each item occupies about 56px.
  // The popup may scroll internally, but a one-item popup must not be treated as 540px tall.
  const desiredHeight = Math.min(viewportHeightAvailable, 104 + 56 * Math.max(1, itemCount));
  const sidebarEdge = Math.max(anchorRight, sidebarRight);
  const rightLeft = sidebarEdge + 10;
  const availableOnRight = viewportWidth - rightLeft - margin;
  const compact = viewportWidth <= 820 || availableOnRight < 260;

  if (compact) {
    return {
      top: safeTop,
      left: margin,
      width: Math.max(0, viewportWidth - margin * 2),
      maxHeight: viewportHeightAvailable,
    };
  }

  const top = Math.max(safeTop, Math.min(anchorTop - margin, viewportHeight - desiredHeight - margin));
  return {
    top,
    left: rightLeft,
    width: Math.min(580, availableOnRight),
    maxHeight: Math.max(0, viewportHeight - top - margin),
  };
}
