// @flow
import * as Constants from '../../constants/devices'
import * as DevicesGen from '../../actions/devices-gen'
import * as Types from '../../constants/types/devices'
import {namedConnect} from '../../util/container'
import DeviceRow from '.'

type OwnProps = {deviceID: Types.DeviceID, firstItem: boolean}

const mapStateToProps = (state, ownProps: OwnProps) => {
  const device = Constants.getDevice(state, ownProps.deviceID)
  return {
    isCurrentDevice: device.currentDevice,
    isRevoked: !!device.revokedByName,
    isNew: !!state.devices.getIn(['isNew', device.deviceID], false),
    name: device.name,
    type: device.type,
  }
}

const mapDispatchToProps = dispatch => ({
  _showExistingDevicePage: (deviceID: Types.DeviceID) =>
    dispatch(DevicesGen.createShowDevicePage({deviceID})),
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  firstItem: ownProps.firstItem,
  isCurrentDevice: stateProps.isCurrentDevice,
  isRevoked: stateProps.isRevoked,
  isNew: stateProps.isNew,
  name: stateProps.name,
  showExistingDevicePage: () => dispatchProps._showExistingDevicePage(ownProps.deviceID),
  type: stateProps.type,
})

export default namedConnect<OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps, mergeProps, 'DeviceRow')(DeviceRow)
