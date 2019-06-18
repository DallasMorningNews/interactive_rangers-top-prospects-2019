import $ from 'jquery';
import Vue from 'vue';

import './furniture';

$(document).ready(() => {
  const RANGERSURL = 'https://interactives.dallasnews.com/data-store/2019/2019-03-rangers-prospects.json';
  const MLBURL = 'https://interactives.dallasnews.com/data-store/2019/mlb-prospects.json';

  let mlbRanks;

  function playerFinder(sourceData, firstName, lastName) {
    const foundPlayer = sourceData.find((player) => {
      if (player.player_first_name === firstName && player.player_last_name === lastName) {
        return true;
      } return false;
    });
    return foundPlayer;
  }

  // Vue.component('chart-unit', {
  //   props: {
  //     player: {
  //       type: Object,
  //       required: true,
  //     },
  //     rankings: {
  //       type: Object,
  //       required: true,
  //     },
  //   },
  //   template: `
  //         <span
  //           v-for="prospect in rankings.top100"
  //           :unit="prospect"
  //           :key="player.lastname + '-' + prospect.player_last_name + '-' + prospect.rank"
  //           :class='"player-unit " + matchesName(prospect)'
  //         >
  //         </span>
  //   `,
  //   computed: {
  //     concatName() {
  //       return this.player.firstname.toLowerCase().replace(' ', '') + this.player.lastname.toLowerCase().replace(' ', '');
  //     },
  //   },
  //   methods: {
  //     matchesName(prospect) {
  //       const rangProspectName = `${this.player.firstname} ${this.player.lastname}`;
  //       const rankProspectName = `${prospect.player_first_name} ${prospect.player_last_name}`;
  //
  //       if (rangProspectName === rankProspectName) {
  //         return 'player-unit--matched';
  //       } return 'player-unit--unmatched';
  //     },
  //   },
  // });

  // Vue.component('prospect-row', {
  //   props: ['prospects'],
  //   data() {
  //     return {
  //       row: { ...this.prospects },
  //     };
  //   },
  //   template: `
  //     <tr>
  //       <td>{{row.rank}}</td>
  //       <td><img :src="'images/_' + imageName + '.jpg'" :alt="row.firstnaem + ' ' + row.lastname"/></td>
  //       <td>{{row.firstname}} {{row.lastname}}</td>
  //       <td>{{row.position}}</td>
  //       <td>{{row.age}}</td>
  //       <td>{{row.level}}</td>
  //     </tr>
  //   `,
  //   computed: {
  //     imageName() {
  //       if (!this.row.playermug) {
  //         return 'defaultPlayer';
  //       } else if (this.row.playermug.replace(' ', '').length > 0) {
  //         return `${this.row.firstname.toLowerCase().replace(' ', '')}${this.row.lastname.toLowerCase().replace(' ', '')}`;
  //       } return 'defaultPlayer';
  //     },
  //   },
  // });

  Vue.component('prospect-card', {
    props: ['prospectData'],
    data() {
      return {
        prospect: { ...this.prospectData },
        mlbRankings: mlbRanks,
      };
    },
    template: `
      <div class='prospect-card'>
        <header class="clearfix">
          <img class="player-mug" :src="'images/_' + imageName + '.jpg'" :alt="prospect.firstname + ' ' + prospect.lastname" />
          <div class="header__content clearfix">
            <div class="pedigree clearfix">
              <img class="pedigree-mug" :src="'images/_' + imageName + '.jpg'" :alt="prospect.firstname + ' ' + prospect.lastname" />
              <h6 class="rank">No. {{prospect.rank}}</h6>
              <h4>{{prospect.firstname}} {{prospect.lastname}} </h4>
            </div>
            <p>
              <span><strong>Pos:</strong> {{prospect.position}}</span>
              <span><strong>Opening day age:</strong> {{prospect.age}}</span>
              <span><strong>MLB comp:</strong> {{prospect.comp}}</span>
            </p>
            <div class="prospect__affiliate">
              <img class="team-logo" :src="'images/_' + logoName + '.jpg'" :alt=prospect.team />
              <div class="affiliate__text">
                <h5>{{prospect.team}}</h5>
                <h6>{{prospectClass}} {{prospect.level}}</h6>
              </div>
            </div>
          </div>
        </header>
        <div class="prospect__content">
          <p><strong>How acquired: </strong>{{prospect.acquired}}</p>
          <p><strong>Latest: </strong>{{prospect.latest}}</p>
          <p><strong>Pros: </strong>{{prospect.pros}}</p>
          <p><strong>Cons: </strong>{{prospect.cons}}</p>
          <p><strong>Second opinion: </strong>{{prospect.secondopinion}}</p>

        </div>
        <div class="prospect__stats" v-if='prospect.seasonstat1 !== undefined'>
          <table>
            <tbody :class="statline + '__table'">
              <tr class="pitcher"><th>Period</th><th>IP</th><th>W</th><th>L</th><th>SO</th><th>ERA</th></tr>
              <tr class="hitter"><th>Period</th><th>AVG</th><th>R</th><th>HR</th><th>RBI</th><th>SO</th></tr>
              <tr v-if='prospect.periodstat1 !== undefined'>
                <td>{{prospect.period}}</td>
                <td>{{prospect.periodstat1}}</td>
                <td>{{prospect.periodstat2}}</td>
                <td>{{prospect.periodstat3}}</td>
                <td>{{prospect.periodstat4}}</td>
                <td>{{prospect.periodstat5}}</td>
              </tr>
              <tr>
                <td>{{statSeason}}</td>
                <td>{{prospect.seasonstat1}}</td>
                <td>{{prospect.seasonstat2}}</td>
                <td>{{prospect.seasonstat3}}</td>
                <td>{{prospect.seasonstat4}}</td>
                <td>{{prospect.seasonstat5}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="charts clearfix">
          <div class="top100-rankings">
            <p class="label"><strong>Overall top 100 rank:</strong> <span v-if="mlbRank">{{mlbRank}}</span><span v-else>NR</span></p>
            <div class="chart-area">
              <span
                v-for="mlbprospect in mlbRankings.top100"
                :key="prospect.lastname + '-' + mlbprospect.player_last_name + '-' + mlbprospect.rank"
                :class='"player-unit " + matchesName(mlbprospect)'
              >
              </span>
            </div>
          </div>

          <div class="tex30-rankings">
            <p class="label"><strong>Rangers top 30 rank:</strong> <span v-if="rangersRank">{{rangersRank}}</span><span v-else>NR</span></p>
            <div class="chart-area">
              <span
                v-for="texprospect in mlbRankings.rangers"
                :key="prospect.lastname + '-' + texprospect.player_last_name + '-' + texprospect.rank"
                :class='"player-unit " + matchesName(texprospect)'
              >
              </span>
            </div>
          </div>
          <p class="source"><strong>Source:</strong> MLB.com</p>
        </div>
      </div>
    `,
    methods: {
      matchesName(mlbprospect) {
        const rangProspectName = `${this.prospect.firstname} ${this.prospect.lastname}`;
        const rankProspectName = `${mlbprospect.player_first_name} ${mlbprospect.player_last_name}`;

        if (rangProspectName === rankProspectName) {
          return 'player-unit--matched';
        } return 'player-unit--unmatched';
      },
    },
    computed: {
      concatName() {
        return this.player.firstname.toLowerCase().replace(' ', '') + this.player.lastname.toLowerCase().replace(' ', '');
      },
      imageName() {
        if (!this.prospect.playermug) {
          return 'defaultPlayer';
        } else if (this.prospect.playermug.replace(' ', '').length > 0) {
          return `${this.prospect.firstname.toLowerCase().replace(' ', '')}${this.prospect.lastname.toLowerCase().replace(' ', '')}`;
        } return 'defaultPlayer';
      },
      logoName() {
        const choppedTeamName = this.prospect.team.split(' ');
        console.log(choppedTeamName);
        return choppedTeamName[choppedTeamName.length - 1].toLowerCase();
      },
      mlbRank() {
        const foundProspect = playerFinder(mlbRanks.top100, this.prospect.firstname, this.prospect.lastname);
        return foundProspect ? foundProspect.rank : undefined;
      },
      prospectClass() {
        if (this.prospect.level.includes('MLB') || this.prospect.level.includes('mlb')) {
          return '';
        } return 'Class';
      },
      rangersRank() {
        const foundProspect = playerFinder(mlbRanks.rangers, this.prospect.firstname, this.prospect.lastname);
        return foundProspect ? foundProspect.rank : undefined;
      },
      statline() {
        if (this.prospect.position.includes('P')) {
          return 'pitcher';
        } return 'hitter';
      },
      statSeason() {
        if (this.prospect.period === 'Spring') {
          return '2018';
        } return 'Season';
      }
    },
  });


  // the drawing of the prospects on the page via Vue
  function drawProspects(prospects) {
    const rangersProspects = new Vue({
      el: '#prospects',
      data: { prospects, mlbRanks },
    });
  }

  // formatting the data by removing the first object, which is the updated date
  // then handing off the remaining data to the drawProspects function
  function formatData(data) {
    const updated = data.splice(0, 1);
    $('.updated').html(updated[0].updatedate);
    drawProspects(data);
  }


  // fetching our data
  const rangersProspects = fetch(RANGERSURL).then(response => response.json());
  const allProspects = fetch(MLBURL).then(response => response.json());

  // once the data has all been fetched, hand off the rangersProspects to be formatted
  Promise.all([rangersProspects, allProspects]).then((values) => {
    mlbRanks = values[1];
    formatData(values[0]);
  });
});
