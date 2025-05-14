import React, { useEffect, useState } from 'react';
import styles from './WelcomeBanner.module.css';
import { HandWaving } from '@phosphor-icons/react';
import bibleVerses from '../../../../mock/bibleVerse';

const getRandomVerse = () => {
    const index = Math.floor(Math.random() * bibleVerses.length);
    return bibleVerses[index];
};

const WelcomeBanner = () => {
    const [verse, setVerse] = useState('');

    useEffect(() => {
        setVerse(getRandomVerse());
    }, []);

    return (
        <div className={styles.banner}>
        <h1 className={styles.title}>¡Bienvenido, a tu jornada, Luis!<HandWaving color='#00c36a'/></h1>
        <p className={styles.subtitle}>{verse}</p>
        </div>
    );
};

export default WelcomeBanner;
