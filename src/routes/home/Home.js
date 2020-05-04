/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import useStyles from 'isomorphic-style-loader/useStyles';
import React from 'react';
import PropTypes from 'prop-types';
import s from './Home.css';

export default function Home({ lol }) {
  useStyles(s);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>5 últimas partidas</h1>
        <ul>
          {lol.map((item, index) => (
            <li key={item.gameCreation}>
              ID da partida: {item.gameCreation} / Season: {item.seasonId} /
              Champion: {item.championName} / Vitória: {item.didWin}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

Home.propTypes = {
  lol: PropTypes.arrayOf(
    PropTypes.shape({
      gameCreation: PropTypes.string.isRequired,
      championName: PropTypes.string.isRequired,
      didWin: PropTypes.string,
    }),
  ).isRequired,
};
