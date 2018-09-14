// @flow
// NOTE: This file is GENERATED from json files in actions/json. Run 'yarn build-actions' to regenerate
/* eslint-disable no-unused-vars,prettier/prettier,no-use-before-define */

import * as I from 'immutable'
import * as RPCTypes from '../constants/types/rpc-gen'
import * as Types from '../constants/types/team-building'
import HiddenString from '../util/hidden-string'

// Constants
export const resetStore = 'common:resetStore' // not a part of team-building but is handled by every reducer. NEVER dispatch this
export const typePrefix = 'team-building:'
export const addUsersToTeamSoFar = 'team-building:addUsersToTeamSoFar'
export const cancelTeamBuilding = 'team-building:cancelTeamBuilding'
export const finishedTeamBuilding = 'team-building:finishedTeamBuilding'
export const removeUsersFromTeamSoFar = 'team-building:removeUsersFromTeamSoFar'
export const search = 'team-building:search'
export const searchResultCountsLoaded = 'team-building:searchResultCountsLoaded'
export const searchResultsLoaded = 'team-building:searchResultsLoaded'

// Payload Types
type _AddUsersToTeamSoFarPayload = $ReadOnly<{|users: Array<Types.User>|}>
type _CancelTeamBuildingPayload = void
type _FinishedTeamBuildingPayload = void
type _RemoveUsersFromTeamSoFarPayload = $ReadOnly<{|users: Array<Types.UserID>|}>
type _SearchPayload = $ReadOnly<{|
  query: string,
  service: string,
  limit?: number,
|}>
type _SearchResultCountsLoadedPayload = $ReadOnly<{|
  counts: {[key: Types.ServiceIdWithContact]: number},
  query: string,
|}>
type _SearchResultsLoadedPayload = $ReadOnly<{|
  users: Array<Types.User>,
  query: string,
  service: string,
|}>

// Action Creators
export const createAddUsersToTeamSoFar = (payload: _AddUsersToTeamSoFarPayload) => ({error: false, payload, type: addUsersToTeamSoFar})
export const createCancelTeamBuilding = (payload: _CancelTeamBuildingPayload) => ({error: false, payload, type: cancelTeamBuilding})
export const createFinishedTeamBuilding = (payload: _FinishedTeamBuildingPayload) => ({error: false, payload, type: finishedTeamBuilding})
export const createRemoveUsersFromTeamSoFar = (payload: _RemoveUsersFromTeamSoFarPayload) => ({error: false, payload, type: removeUsersFromTeamSoFar})
export const createSearch = (payload: _SearchPayload) => ({error: false, payload, type: search})
export const createSearchResultCountsLoaded = (payload: _SearchResultCountsLoadedPayload) => ({error: false, payload, type: searchResultCountsLoaded})
export const createSearchResultsLoaded = (payload: _SearchResultsLoadedPayload) => ({error: false, payload, type: searchResultsLoaded})

// Action Payloads
export type AddUsersToTeamSoFarPayload = $Call<typeof createAddUsersToTeamSoFar, _AddUsersToTeamSoFarPayload>
export type CancelTeamBuildingPayload = $Call<typeof createCancelTeamBuilding, _CancelTeamBuildingPayload>
export type FinishedTeamBuildingPayload = $Call<typeof createFinishedTeamBuilding, _FinishedTeamBuildingPayload>
export type RemoveUsersFromTeamSoFarPayload = $Call<typeof createRemoveUsersFromTeamSoFar, _RemoveUsersFromTeamSoFarPayload>
export type SearchPayload = $Call<typeof createSearch, _SearchPayload>
export type SearchResultCountsLoadedPayload = $Call<typeof createSearchResultCountsLoaded, _SearchResultCountsLoadedPayload>
export type SearchResultsLoadedPayload = $Call<typeof createSearchResultsLoaded, _SearchResultsLoadedPayload>

// All Actions
// prettier-ignore
export type Actions =
  | AddUsersToTeamSoFarPayload
  | CancelTeamBuildingPayload
  | FinishedTeamBuildingPayload
  | RemoveUsersFromTeamSoFarPayload
  | SearchPayload
  | SearchResultCountsLoadedPayload
  | SearchResultsLoadedPayload
  | {type: 'common:resetStore', payload: void}
