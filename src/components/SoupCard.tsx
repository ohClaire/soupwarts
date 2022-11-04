import { random } from 'cypress/types/lodash';
import { stringify } from 'querystring';
import React, { useState, useEffect, ReactNode } from 'react';
import { getSoups } from '../apiCalls';
import { NavLink } from 'react-router-dom';
import './SoupCard.css';
import loadingGif from '../assets/loading.gif';

type CardProps = {
  house: string;
};

export type Recipe = {
  title: string;
  ingredients: string;
  servings: string;
  instructions: string;
};

export default function SoupCard(props: CardProps) {
  const [randomSoup, setRandomSoup] = useState<Recipe>({
    title: '',
    ingredients: '',
    servings: '',
    instructions: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSoups(props.house)
      .then((data) => {
        const randomIndex = Math.floor(Math.random() * data.length);
        setRandomSoup(data[randomIndex]);
      })
      .catch((error) => setError(error.message));
  }, []);

  const listItems = (recipeSection: string): ReactNode => {
    let count = 0;
    return recipeSection.split(/[.|]+/).map((item: string) => {
      return <p key={item + '-' + count++}>{item}</p>;
    });
  };

  const homeButton = (): ReactNode => {
    return (
      <NavLink className="button-container" to="/">
        <span className="text">Return Home</span>
        <button id="work" type="button" name="Hover" className="home-btn wand">
          Return Home
        </button>
      </NavLink>
    );
  };

  const recipeCard = randomSoup.title !== '' && (
    <div>
      <h2 className="card-title">{randomSoup.title}</h2>
      <p className="card-serving">Yields {randomSoup.servings}</p>
      <div className="recipe">
        <div className="recipe-ingredients">
          <h4>Ingredients</h4>
          <section className="row=">{listItems(randomSoup.ingredients)}</section>
        </div>
        <div className="recipe-instructions">
          <h4>Instructions</h4>
          <section>{listItems(randomSoup.instructions)}</section>
        </div>
      </div>
      {homeButton()}
    </div>
  );

  const errorMessage = (
    <>
      <p>{error}. Try again later.</p>
      {homeButton()}
    </>
  );

  return (
    <article className="recipe-container">
      {error ? errorMessage : recipeCard}
      {randomSoup.title === '' ? (
        <img src={loadingGif} className="loading-icon" />
      ) : null}
    </article>
  );
}
