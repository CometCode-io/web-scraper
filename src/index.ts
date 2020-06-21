import axios from 'axios';
import cheerio from 'cheerio';

const url = 'https://www.premierleague.com/stats/top/players/goals?se=-1&cl=-1&iso=-1&po=-1?se=-1'; // URL we're scraping
const AxiosInstance = axios.create(); // Create a new Axios Instance

// This is the structure of the player data we recieve
interface PlayerData {
  rank: number; // 1 - 20 rank
  name: string;
  nationality: string;
  goals: number;
}

// Send an async HTTP Get request to the url
AxiosInstance.get(url)
  .then( // Once we have data returned ...
    response => {
      const html = response.data; // Get the HTML from the HTTP request
      const $ = cheerio.load(html); // Load the HTML string into cheerio
      const statsTable: Cheerio = $('.statsTableContainer > tr'); // Parse the HTML and extract just whatever code contains .statsTableContainer and has tr inside
      const topScorers: PlayerData[] = [];

      statsTable.each((i, elem) => {
        const rank: number = parseInt($(elem).find('.rank > strong').text()); // Parse the rank
        const name: string = $(elem).find('.playerName > strong').text(); // Parse the name
        const nationality: string = $(elem).find('.playerCountry').text(); // Parse the country
        const goals: number = parseInt($(elem).find('.mainStat').text()); // Parse the number of goals
        topScorers.push({
          rank,
          name,
          nationality,
          goals
        })
      })

      console.log(topScorers);
    }
  )
  .catch(console.error); // Error handling
