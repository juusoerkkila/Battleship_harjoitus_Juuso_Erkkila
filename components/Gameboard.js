import React, { useState, useEffect, useRef } from "react";
import { Text, View, Pressable } from 'react-native';
import Entypo from "@expo/vector-icons/Entypo"
import styles from '../style/style';



const NBR_OF_ROWS = 5;
const NBR_OF_COLS = 5;
const CIRCLE = 'circle';
const CROSS = 'cross';
const START = 'plus';

let initialBoard = new Array(NBR_OF_COLS * NBR_OF_ROWS).fill(START);

export default function Gameboard() {

    const [board, setBoard] = useState(initialBoard);
    const [status, setStatus] = useState('');
    const [begin, setBegin] = useState(false);
    const [buttonText, setButtonText] = useState('Aloita peli');
    const [clock, setClock] = useState(30);
    const [bombsLeft, setBombsLeft] = useState(15);
    const [shipsLeft, setShipsLeft] = useState(3);
    const [strike, setStrike] = useState(0);
    const [locations,] = useState([]);
    const timeRef = useRef();




    function beginGame() {
        let initialBoard = new Array(NBR_OF_COLS * NBR_OF_ROWS).fill(START);
        setClock(30);
        setBoard(initialBoard);
        setStrike(0);
        setBombsLeft(15);
        setShipsLeft(3);

        shipLocations();
        if (begin) {
            Stop();
            setTime();
        } else {
            setBegin(begin => !begin);
            setTime();
            setStatus('Peli alkanut');
            setButtonText('Uusi peli');
            setBoard(initialBoard);

        }
    }



    function shipLocations() {
        for (let i = 0; i < shipsLeft; i++) {
            let randomNumber = Math.floor(Math.random() * (NBR_OF_ROWS * NBR_OF_COLS));
            if (locations.includes(randomNumber) === -1) {
                locations.push(randomNumber);
            } else {
                randomNumber = Math.floor(Math.random() * (NBR_OF_ROWS * NBR_OF_COLS));
                locations.push(randomNumber);
            }
        }
    }


    function setTime() {
        const time = setInterval(() => setClock(clock => clock - 1), 1000);
        timeRef.current = time;
    }

    function Stop() {
        clearInterval(timeRef.current);
    }





    function Bombing(number) {

        if (begin && bombsLeft > 0) {

            setBombsLeft(bombsLeft => bombsLeft - 1);

            if (board[number] === START) {
                if (locations.includes(number)) {
                    board[number] = CIRCLE;
                    setShipsLeft(shipsLeft => shipsLeft - 1);
                    setStrike(strike => strike + 1);

                }
                else {
                    board[number] = CROSS;
                }
            }
        }
        else {
            setStatus('Aloita peli')
        }
    }



    function initialize() {
        Stop();
    }



    useEffect(() => {

        if (clock === 0) {
            initialize();
            setBegin(begin => !begin)
            setStatus('Aika Loppui')
        }

        if (bombsLeft === 0 && shipsLeft > 0) {
            initialize();
            setStatus('Hävisit pelin');
            
        }

        else if (strike === 3) {
            initialize();
            setStatus('Voitit pelin.');
            setBegin(begin => !begin)
        }
    }, [clock]);


    function chooseItemColor(number) {
        if (board[number] === CROSS) {
            return '#FF3031'
        }
        else if (board[number] === CIRCLE) {
            return '#45CE30'
        } else {
            return '#74B9FF'
        }
    }

    const items = [];
    for (let x = 0; x < NBR_OF_ROWS; x++) {
        const cols = [];
        for (let y = 0; y < NBR_OF_COLS; y++) {
            cols.push(
                <Pressable
                    key={x * NBR_OF_COLS + y}
                    style={styles.item}
                    onPress={() => Bombing(x * NBR_OF_COLS + y)}>
                    <Entypo
                        key={x * NBR_OF_COLS + y}
                        name={board[x * NBR_OF_ROWS + y]}
                        size={32}
                        color={chooseItemColor(x * NBR_OF_COLS + y)} />
                </Pressable>
            );
        }
        let row =
            <View key={"row" + x}>
                {cols.map((item) => item)}
            </View>
        items.push(row);
    }

    return (

        <View style={styles.gameboard}>
            <View style={styles.flex}>{items}</View>
            <Text style={styles.gameinfo}>Osumat: {strike} Pommit: {bombsLeft} Laivat: {shipsLeft} </Text>
            <Text style={styles.gameinfo}>Time: {clock} sec </Text>
            <Text style={styles.gameinfo}>Status: {status}</Text>
            <Pressable style={styles.button} onPress={() => beginGame()}>
                <Text style={styles.buttonText}>{buttonText}</Text>
            </Pressable>
        </View>

    );







}