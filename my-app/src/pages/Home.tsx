import React from 'react';
const integers =[1,2,3,4]
const Home: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>{integers[0]}</p>
    </div>
  );
};

export default Home;