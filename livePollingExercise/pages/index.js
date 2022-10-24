import Head from 'next/head';
import LivePoll from '../components/LivePoll';
import Questionnaire from '../components/Questionnaire';
import Button from '@mui/material/Button';
import React from 'react';

// Adding Call to Mongo DB Data API for Polling Intial Data and Polling Results
export async function getServerSideProps(context) {
  let { res } = context;
  res = await fetch(process.env.POLL_DATA_API, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.API_KEY,
    }
  });;
  const pollData = await res.json();

  res = await fetch(process.env.POLL_RESULT_API, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.API_KEY,
    }
  });
  const pollResult = await res.json();

  return {
    props: { pollData, pollResult },
  };
}

export function refreshApp() {
  window.location.reload();
}
// Passing Props to be used in the Component as a test before passing to The Live Poll Component
export default function Home({ pollData, pollResult }) {
  const[showPoll, setShowPoll] = React.useState({show:false, label:"Take Poll"});

  function handleChange(){
    let next;
    if(showPoll.show){
      next = {show:false, label:"Take Poll"};
    } else {
      next = {show:true, label:"Hide Poll"};
    }
    setShowPoll(next);
  }

  console.log(pollData);
  console.log(pollResult);
  return (
    <div className="container">
      <Head>
        <title>Battle Of the Games</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Which Game is KING Right Now?
        </h1>
        {/* Passing Props for the DB data to each individual component */}
        <LivePoll pollData={pollData} pollResult={pollResult} />
        <Questionnaire className={{}} pollData={pollData} />
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        .displayPoll {
          display: block;
          margin-top: 10px;
          animation: reveal 2s 1;
        }

        .hidePoll {
          display: none;
        }

        @keyframes reveal {
          from {
            opacity: 0;
            margin-top: 50px;
          }
          to {
            opacity: 1;
            margin-top: 10px;
          }
        }

        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
