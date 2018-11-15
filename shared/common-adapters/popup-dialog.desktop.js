// @flow
import * as React from 'react'
import Box from './box'
import Icon from './icon'
import EscapeHandler from '../util/escape-handler.desktop'
import * as Styles from '../styles'

import type {Props} from './popup-dialog'

function stopBubbling(ev) {
  ev.stopPropagation()
}

export function PopupDialog({
  children,
  onClose,
  onMouseUp,
  onMouseDown,
  onMouseMove,
  fill,
  styleCover,
  styleContainer,
  styleClose,
  styleClipContainer,
  allowClipBubbling,
}: Props) {
  return (
    <EscapeHandler onESC={onClose}>
      <Box
        style={Styles.collapseStyles([styles.cover, styleCover])}
        onClick={onClose}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      >
        <Box style={Styles.collapseStyles([styles.container, fill && styles.containerFill, styleContainer])}>
          <Icon
            type="iconfont-close"
            style={Styles.collapseStyles([styles.close, styleClose])}
            color={Styles.globalColors.white}
            onClick={onClose}
          />
          <Box
            style={Styles.collapseStyles([styles.clipContainer, styleClipContainer])}
            onClick={allowClipBubbling ? undefined : stopBubbling}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </EscapeHandler>
  )
}

const styles = Styles.styleSheetCreate({
  clipContainer: Styles.platformStyles({
    isElectron: {
      ...Styles.globalStyles.flexBoxColumn,
      backgroundColor: Styles.globalColors.white,
      borderRadius: Styles.borderRadius,
      boxShadow: `0 2px 5px 0 ${Styles.globalColors.black_20}`,
      flex: 1,
      maxWidth: '100%',
      position: 'relative',
    },
  }),
  close: Styles.platformStyles({
    isElectron: {
      cursor: 'pointer',
      position: 'absolute',
      right: -16 - Styles.globalMargins.tiny + 2, // FIXME: 2px fudge since icon isn't sized to 16px extents
    },
  }),
  container: {
    ...Styles.globalStyles.flexBoxRow,
    maxHeight: '100%',
    maxWidth: '100%',
    position: 'relative',
  },
  containerFill: {
    height: '100%',
    width: '100%',
  },
  cover: {
    ...Styles.globalStyles.flexBoxColumn,
    ...Styles.globalStyles.fillAbsolute,
    alignItems: 'center',
    backgroundColor: Styles.globalColors.black_60,
    justifyContent: 'center',
    paddingBottom: Styles.globalMargins.small,
    paddingLeft: Styles.globalMargins.large,
    paddingRight: Styles.globalMargins.large,
    paddingTop: Styles.globalMargins.small,
    zIndex: 30, // Put the popup on top of any sticky section headers.
  },
})

export default PopupDialog
