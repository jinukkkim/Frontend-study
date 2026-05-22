import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function DetailPage() {
  // 1. URL(예: /pokemon/1)에서 id 값을 가져옵니다.
  const { id } = useParams(); 
  const [pokemonDetail, setPokemonDetail] = useState(null);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      // 2. GraphQL 쿼리 작성 (원하는 데이터 구조만 정확하게 요청)
      // $pokemonId 라는 변수를 사용하여 동적으로 ID를 받습니다.
      const query = `
        query getPokemonDetail($pokemonId: Int!) {
          pokemon_v2_pokemon(where: {id: {_eq: $pokemonId}}) {
            id
            name
            height
            weight
            pokemon_v2_pokemontypes {
              pokemon_v2_type {
                name
              }
            }
          }
        }
      `;

      try {
        // 3. axios.post를 사용하여 GraphQL 엔드포인트로 요청을 보냅니다.
        const response = await axios.post('https://beta.pokeapi.co/graphql/v1beta', {
          query: query,
          variables: { pokemonId: parseInt(id) } // 쿼리의 $pokemonId에 실제 id 값을 넣어줍니다.
        });
        
        // 4. 받아온 데이터 구조에 맞게 상태를 업데이트합니다.
        // GraphQL 응답은 보통 response.data.data 안에 우리가 요청한 객체가 들어있습니다.
        setPokemonDetail(response.data.data.pokemon_v2_pokemon[0]);
      } catch (error) {
        console.error("GraphQL 통신 에러:", error);
      }
    };

    fetchPokemonDetail();
  }, [id]); // 의존성 배열에 id를 넣어, id가 바뀔 때마다(다른 포켓몬 클릭 시) 새로 데이터를 가져옵니다.

  // 데이터가 도착하기 전(null)에는 로딩 문구를 보여줍니다.
  if (!pokemonDetail) return <div>포켓몬 정보 로딩 중...</div>;

  return (
    <div>
      <Link to="/">⬅️ 메인으로 돌아가기</Link>
      <h2>{pokemonDetail.name} (No. {pokemonDetail.id})</h2>
      <ul>
        <li>키: {pokemonDetail.height / 10}m</li>
        <li>몸무게: {pokemonDetail.weight / 10}kg</li>
        <li>
          타입: {pokemonDetail.pokemon_v2_pokemontypes.map(t => t.pokemon_v2_type.name).join(', ')}
        </li>
      </ul>
    </div>
  );
}

export default DetailPage;