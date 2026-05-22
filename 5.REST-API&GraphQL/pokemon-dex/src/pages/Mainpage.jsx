import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MainPage() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=20');
        setPokemons(response.data.results);
      } catch (error) {
        console.error("데이터 통신 에러:", error);
      }
    };

    fetchPokemons();
  }, []); // 의존성 배열을 비워두어 처음 렌더링될 때만 실행되게 합니다.

  return (
    <div>
      <h1>포켓몬 도감 (REST API)</h1>
      <ul>
        {pokemons.map((pokemon, index) => (
          <li key={pokemon.name}>
            {/* API에서 주는 리스트에는 ID가 없어서 index를 임시로 활용해 링크를 연결합니다 */}
            <Link to={`/pokemon/${index + 1}`}>
              {pokemon.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MainPage;