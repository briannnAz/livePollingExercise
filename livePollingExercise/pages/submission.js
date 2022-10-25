import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import React from 'react';
import { CircularProgress } from '@mui/material';


// Defined a new page to utilize getServerSideProps on Submission of the poll form since it only runs at build time.
export async function getServerSideProps(context) {
    let { res, query } = context;
    console.log(JSON.stringify(query));

    // Changing the request to Match the request in my Mongo DB Data API instance. Uses API_KEY, POST Method, and body from Questionnaire sent as a query param
    res = await fetch(process.env.POLL_INSERT_API, {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.API_KEY,
        }
    });
    const insertResult = await res.json();

    return {
        props: { insertResult, query },
    };
}

export default function InsertResult({ insertResult }) {
    const [countDown, setCountDown] = React.useState(5);

    // Creating a New instance of router to return back ot the main index.js page
    const newRouter = useRouter();
    React.useEffect(() => {
        let redirect = setTimeout(() => {
            setCountDown((current) => current - 1);
        }, 1000);
        if(countDown == 0){
            clearTimeout(redirect);
            newRouter.push('/');
        };
    }, [countDown]);

    return (
        <div style={{
            textAlign: 'center',
            paddingTop: '35%',
        }}>
            <h1>Thanks for your Submission!</h1>
            <CircularProgress sx={{
                width: 300
            }} />
            <h3>Redirecting back to the live poll in {countDown}.</h3>
            {insertResult}
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
    );
}