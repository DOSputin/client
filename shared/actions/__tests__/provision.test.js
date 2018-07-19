// @flow
/* eslint-env jest */
import * as Types from '../../constants/types/provision'
import * as RPCTypes from '../../constants/types/rpc-gen'
import * as Constants from '../../constants/provision'
import * as Tabs from '../../constants/tabs'
import * as ProvisionGen from '../provision-gen'
import * as RouteTree from '../route-tree'
import * as Saga from '../../util/saga'
import type {TypedState} from '../../constants/reducer'
import HiddenString from '../../util/hidden-string'
import {_testing} from '../provision'
import reducer from '../../reducers/provision'

jest.unmock('immutable')

const makeTypedState = (provisionState: Types.State): TypedState => ({provision: provisionState}: any)

describe('provisioningManagerProvisioning', () => {
  const m = _testing.makeProvisioningManager(false)
  const callMap = m.getIncomingCallMap()

  it('cancels are correct', () => {
    const keys = ['keybase.1.gpgUi.selectKey', 'keybase.1.loginUi.getEmailOrUsername']
    keys.forEach(k => {
      const r = {error: jest.fn(), result: jest.fn()}
      // $FlowIssue
      callMap[k](undefined, r, undefined)
      expect(r.result).not.toHaveBeenCalled()
      expect(r.error).toHaveBeenCalledWith({
        code: RPCTypes.constantsStatusCode.scgeneric,
        desc: 'Canceling RPC',
      })
    })
  })

  it('ignores are correct', () => {
    const keys = [
      'keybase.1.loginUi.displayPrimaryPaperKey',
      'keybase.1.provisionUi.ProvisioneeSuccess',
      'keybase.1.provisionUi.ProvisionerSuccess',
      'keybase.1.provisionUi.DisplaySecretExchanged',
    ]
    keys.forEach(k => {
      const r = {error: jest.fn(), result: jest.fn()}
      // $FlowIssue
      callMap[k](undefined, r, undefined)
      expect(r.result).not.toHaveBeenCalled()
      expect(r.error).not.toHaveBeenCalled()
    })
  })

  it('text code works', () => {
    const state = Constants.makeState()
    const call = callMap['keybase.1.provisionUi.DisplayAndPromptSecret']
    if (!call) {
      throw new Error('No call')
    }
    const r = {error: jest.fn(), result: jest.fn()}
    const phrase = 'mocktest'
    const put: any = call(({phrase}: any), r, makeTypedState(state))
    if (!put || !put.PUT) {
      throw new Error('no put')
    }
    const action = put.PUT.action
    expect(m._stashedResponse).toEqual(r)
    expect(m._stashedResponseKey).toEqual('keybase.1.provisionUi.DisplayAndPromptSecret')
    expect(action.payload.code.stringValue()).toEqual(phrase)

    const nextState = makeTypedState(reducer(state, action))
    expect(nextState.provision.codePageTextCode.stringValue()).toEqual(phrase)
    expect(nextState.provision.error.stringValue()).toEqual('')

    expect(_testing.showCodePage(nextState)).toEqual(
      Saga.put(RouteTree.navigateAppend(['codePage'], [Tabs.loginTab, 'login']))
    )
  })
  it('text code error works', () => {
    const state = Constants.makeState()
    const call = callMap['keybase.1.provisionUi.DisplayAndPromptSecret']
    if (!call) {
      throw new Error('No call')
    }
    const r = {error: jest.fn(), result: jest.fn()}
    const phrase = 'mocktest'
    const error = 'anerror'
    const put: any = call(({phrase, previousErr: error}: any), r, makeTypedState(state))
    if (!put || !put.PUT) {
      throw new Error('no put')
    }
    const action = put.PUT.action
    expect(m._stashedResponse).toEqual(r)
    expect(m._stashedResponseKey).toEqual('keybase.1.provisionUi.DisplayAndPromptSecret')
    expect(action.payload.code.stringValue()).toEqual(phrase)
    expect(action.payload.error.stringValue()).toEqual(error)

    const nextState = makeTypedState(reducer(state, action))
    expect(nextState.provision.codePageTextCode.stringValue()).toEqual(phrase)
    expect(nextState.provision.error.stringValue()).toEqual(error)

    expect(_testing.showCodePage(nextState)).toBeFalsy()
  })

  // 'keybase.1.provisionUi.PromptNewDeviceName': this.promptNewDeviceNameHandler,
  // 'keybase.1.provisionUi.chooseDevice': this.chooseDeviceHandler,
  // 'keybase.1.provisionUi.chooseGPGMethod': this.chooseGPGMethodHandler,
  // 'keybase.1.secretUi.getPassphrase': this.getPassphraseHandler,
  // it('fills inviteCode, shows invite screen', () => {
  // const action = SignupGen.createRequestedAutoInvite({inviteCode: 'hello world'})
  // const nextState = makeTypedState(reducer(state, action))
  // expect(nextState.signup.inviteCode).toEqual(action.payload.inviteCode)
  // expect(_testing.showInviteScreen()).toEqual(navigateTo([loginTab, 'signup', 'inviteCode']))
  // })
})

describe('provisioningManagerAddNewDevice', () => {})

// TODO
// maybeCancelProvision,
// showDeviceListPage,
// showFinalErrorPage,
// showGPGPage,
// showNewDeviceNamePage,
// showPaperkeyPage,
// showPassphrasePage,