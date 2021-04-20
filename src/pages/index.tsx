import Head from 'next/head'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
// https://czg.vercel.app/

export default function Home() {
    const [websiteURL, setWebsiteURL] = useState('https://czg.vercel.app/')

    const [imageURL, setImageURL] = useState(`/api/snapshot/desktop/index.img?url=https://czg.vercel.app/`)

    async function submitWebsiteURL() {
        let filename = `snapshot/home/index${Math.floor(Math.random() * 20)}.png`
        const res = await fetch('/api/screenshot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: websiteURL,
                filename: filename
            })
        }).then((res) => res.json())
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>screenshot sever</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <img key={imageURL} src={imageURL} width={1280} height={720} />
            <div className={styles.inputArea}>
                <input
                    type="text"
                    value={websiteURL}
                    onChange={(e) => setWebsiteURL(e.target.value)}
                    placeholder="Enter a website URL"
                />
                <button onClick={submitWebsiteURL}>Submit URL</button>
            </div>
        </div>
    )
}
