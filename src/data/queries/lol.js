/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLList as List } from 'graphql';
import MatchesType from '../types/MatchesType';

const { Kayn, REGIONS } = require('kayn');

const kayn = Kayn('RGAPI-5723b425-bcf5-40a1-92e3-44e3089a6cb4')({
  region: REGIONS.BRAZIL,
  apiURLPrefix: 'https://%s.api.riotgames.com',
  locale: 'pt_BR',
  debugOptions: {
    isEnabled: true,
    showKey: false,
  },
  requestOptions: {
    shouldRetry: true,
    numberOfRetriesBeforeAbort: 3,
    delayBeforeRetry: 1000,
    burst: false,
    shouldExitOn403: false,
  },
  cacheOptions: {
    cache: null,
    timeToLives: {
      useDefault: false,
      byGroup: {},
      byMethod: {},
    },
  },
});

// React.js - LoL Matches
const processMatch = (championIdMap, summonerId, match) => {
  // console.log('match', match)
  match.participants.map((part, i) => {
    console.log('part', part)
    // if( part ){
    //   console.log('parts', part[i].stats)
    // }
  })
  const { participantId } = match.participantIdentities.find(
    pi => pi.player.summonerId === summonerId,
  );
  const participant = match.participants.find(
    p => p.participantId === participantId,
  );
  const champion = championIdMap.data[participant.championId];
  return {
    gameCreation: match.gameCreation,
    seasonId: match.seasonId,
    didWin:
      participant.teamId ===
      match.teams.find(({ win }) => win === 'Win').teamId,
    championName: champion.name,
  };
};

const lol = {
  type: new List(MatchesType),
  async resolve() {
    const championIdMap = await kayn.DDragon.Champion.listDataByIdWithParentAsId();
    const { id, accountId } = await kayn.Summoner.by.name('kascharowski');
    const { matches } = await kayn.Matchlist.by
      .accountID(accountId)
      .query({ queue: 420 });
    const gameIds = matches.slice(0, 1).map(({ gameId }) => gameId);
    const matchDtos = await Promise.all(gameIds.map(kayn.Match.get));
    // `processor` is a helper function to make the subsequent `map` cleaner.
    const processor = match => processMatch(championIdMap, id, match);
    const results = await Promise.all(matchDtos.map(processor));
    // let ress = [];
    // ress = [
    //   {
    //     gameCreation: 1588545660811,
    //     seasonId: 13,
    //     didWin: false,
    //     championName: 'Miss Fortune',
    //   },
    //   {
    //     gameCreation: 1588543171077,
    //     seasonId: 13,
    //     didWin: false,
    //     championName: 'Miss Fortune',
    //   },
    //   {
    //     gameCreation: 1588525534058,
    //     seasonId: 13,
    //     didWin: false,
    //     championName: 'Veigar',
    //   },
    //   {
    //     gameCreation: 1588519743345,
    //     seasonId: 13,
    //     didWin: true,
    //     championName: 'Miss Fortune',
    //   },
    //   {
    //     gameCreation: 1588517919115,
    //     seasonId: 13,
    //     didWin: false,
    //     championName: 'Veigar',
    //   },
    //   {
    //     gameCreation: 1588516134603,
    //     seasonId: 13,
    //     didWin: false,
    //     championName: 'Veigar',
    //   },
    //   {
    //     gameCreation: 1588460128642,
    //     seasonId: 13,
    //     didWin: true,
    //     championName: 'Veigar',
    //   },
    //   {
    //     gameCreation: 1588457097369,
    //     seasonId: 13,
    //     didWin: true,
    //     championName: 'Veigar',
    //   },
    //   {
    //     gameCreation: 1588437556088,
    //     seasonId: 13,
    //     didWin: true,
    //     championName: 'Fizz',
    //   },
    //   {
    //     gameCreation: 1588367572023,
    //     seasonId: 13,
    //     didWin: false,
    //     championName: 'Veigar',
    //   },
    // ];
    // console.log('results', results)
    return results;
  },
};

export default lol;

// module.exports =
