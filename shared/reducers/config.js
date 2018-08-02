// @flow
import logger from '../logger'
import * as I from 'immutable'
import * as Types from '../constants/types/config'
import * as Constants from '../constants/config'
import * as ConfigGen from '../actions/config-gen'

const initialState = Constants.makeState()

export default function(
  state: Types.State = initialState,
  action:
    | ConfigGen.Actions
    | ConfigGen.ChangedFocusPayload
    | ConfigGen.ChangedActivePayload
    | {type: 'remote:updateMenubarWindowID', payload: {id: number}}
): Types.State {
  switch (action.type) {
    case ConfigGen.resetStore:
      return initialState.merge({
        daemonHandshakeWaiters: state.daemonHandshakeWaiters,
        logoutHandshakeWaiters: state.logoutHandshakeWaiters,
        menubarWindowID: state.menubarWindowID,
      })
    case ConfigGen.restartHandshake:
      return state.merge({
        daemonError: null,
        daemonHandshakeFailedReason: '',
        daemonHandshakeRetriesLeft: Math.max(state.daemonHandshakeRetriesLeft - 1, 0),
      })
    case ConfigGen.startHandshake:
      return state.merge({
        daemonError: null,
        daemonHandshakeFailedReason: '',
        daemonHandshakeRetriesLeft: Constants.maxHandshakeTries,
      })
    case ConfigGen.logoutHandshake:
      return state.merge({logoutHandshakeWaiters: I.Map()})
    case ConfigGen.daemonHandshakeWait: {
      const oldCount = state.daemonHandshakeWaiters.get(action.payload.name, 0)
      const newCount = oldCount + (action.payload.increment ? 1 : -1)
      const newState =
        newCount === 0
          ? state.deleteIn(['daemonHandshakeWaiters', action.payload.name])
          : state.setIn(['daemonHandshakeWaiters', action.payload.name], newCount)
      // Keep the first error
      if (state.daemonHandshakeFailedReason) {
        return newState
      }
      return newState.set('daemonHandshakeFailedReason', action.payload.failedReason || '')
    }
    case ConfigGen.logoutHandshakeWait: {
      const oldCount = state.logoutHandshakeWaiters.get(action.payload.name, 0)
      const newCount = oldCount + (action.payload.increment ? 1 : -1)
      return newCount === 0
        ? state.deleteIn(['logoutHandshakeWaiters', action.payload.name])
        : state.setIn(['logoutHandshakeWaiters', action.payload.name], newCount)
    }
    case ConfigGen.pushLoaded:
      return state.merge({pushLoaded: action.payload.pushLoaded})
    case ConfigGen.extendedConfigLoaded:
      return state.merge({extendedConfig: action.payload.extendedConfig})
    case ConfigGen.changeKBFSPath:
      return state.merge({kbfsPath: action.payload.kbfsPath})
    case ConfigGen.bootstrapStatusLoaded:
      return state.merge({
        deviceID: action.payload.deviceID,
        deviceName: action.payload.deviceName,
        followers: I.Set(action.payload.followers),
        following: I.Set(action.payload.following),
        loggedIn: action.payload.loggedIn,
        registered: action.payload.registered,
        uid: action.payload.uid,
        username: action.payload.username,
      })
    case ConfigGen.loggedIn:
      return state.merge({loggedIn: true})
    case ConfigGen.loggedOut:
      return state.merge({loggedIn: false})
    case ConfigGen.updateFollowing: {
      const {isTracking, username} = action.payload
      return state.updateIn(
        ['following'],
        following => (isTracking ? following.add(username) : following.delete(username))
      )
    }
    case ConfigGen.globalError: {
      const {globalError} = action.payload
      if (globalError) {
        logger.error('Error (global):', globalError)
      }
      return state.merge({globalError})
    }
    case ConfigGen.debugDump:
      return state.merge({debugDump: action.payload.items})
    case ConfigGen.daemonError: {
      const {daemonError} = action.payload
      if (daemonError) {
        logger.error('Error (daemon):', daemonError)
      }
      return state.merge({daemonError})
    }
    case ConfigGen.setInitialState:
      return state.merge({initialState: action.payload.initialState})
    case ConfigGen.changedFocus:
      return state.merge({
        appFocused: action.payload.appFocused,
        appFocusedCount: state.appFocusedCount + 1,
      })
    case ConfigGen.changedActive:
      return state.merge({userActive: action.payload.userActive})
    case ConfigGen.loadedAvatars: {
      const {nameToUrlMap} = action.payload
      return state.merge({
        avatars: {
          ...state.avatars,
          ...nameToUrlMap,
        },
      })
    }
    case ConfigGen.setNotifySound:
      return state.merge({notifySound: action.payload.sound})
    case ConfigGen.setOpenAtLogin:
      return state.merge({openAtLogin: action.payload.open})
    case 'remote:updateMenubarWindowID':
      return state.merge({menubarWindowID: action.payload.id})
    case ConfigGen.setStartedDueToPush:
      return state.merge({startedDueToPush: true})
    case ConfigGen.configLoaded:
      return state.merge({
        version: action.payload.version,
        versionShort: action.payload.versionShort,
      })
    case ConfigGen.configuredAccounts:
      return state.merge({configuredAccounts: I.List(action.payload.accounts)})
    case ConfigGen.setDeletedSelf:
      return state.merge({justDeletedSelf: action.payload.deletedUsername})

    // Saga only actions
    case ConfigGen.loadTeamAvatars:
    case ConfigGen.loadAvatars:
    case ConfigGen.clearRouteState:
    case ConfigGen.persistRouteState:
    case ConfigGen.dumpLogs:
    case ConfigGen.link:
    case ConfigGen.mobileAppState:
    case ConfigGen.openAppSettings:
    case ConfigGen.showMain:
    case ConfigGen.setupEngineListeners:
    case ConfigGen.daemonHandshake:
    case ConfigGen.installerRan:
    case ConfigGen.daemonHandshakeDone:
    case ConfigGen.logout:
      return state
    default:
      /*::
      declare var ifFlowErrorsHereItsCauseYouDidntHandleAllActionTypesAbove: (action: empty) => any
      ifFlowErrorsHereItsCauseYouDidntHandleAllActionTypesAbove(action);
      */
      return state
  }
}
