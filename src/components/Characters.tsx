import { useState, useEffect } from 'react';
import {motion} from 'framer-motion';



interface Type {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Type[];
}
const svgVariants = {
  hidden:{rotate: -360},
  visible:{rotate: 0, transition:{duration:1, repeat: Infinity}}
}

export default function CharacterList() {
  const [characters, setCharacters] = useState<Type[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCharacter, setSelectedCharacter] = useState<Type | null>(null);
  const [delayDuration, setDelayDuration] = useState(3000);

  useEffect(() => {
    fetchCharacters(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  const fetchCharacters = async (page: number, status: string) => {
    setLoading(true);
    try {
      const statusQuery = status !== 'all' ? `&status=${status}` : '';
      const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}${statusQuery}`);
      const data: ApiResponse = await response.json();
      setCharacters(data.results);
      setTotalPages(data.info.pages);
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return 'bg-green-500';
      case 'dead':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const PaginationControls = () => (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        Previous
      </button>
      <span className="px-4 py-2 text-white">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        Next
      </button>
    </div>
  );

  useEffect(() => {
    if (loading) {
      const timer =  setTimeout(() => {
          setLoading(false);
       }, delayDuration);
        return () => clearTimeout(timer);
    }
  }, [loading]);


  if (loading) {
    return (
        <div role="status">
            <motion.svg aria-hidden="true" className=" text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 w-20 justify-center m-auto" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg" variants={svgVariants} initial="hidden" animate="visible">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </motion.svg>
        </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-col lg:justify-between items-center gap-4 mb-8">
          <select 
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-gray-700 lg:w-full text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Characters</option>
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>
          <PaginationControls />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {characters.map((character) => (
            <div
              key={character.id}
              className="bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={character.image}
                alt={character.name}
                className="w-full aspect-square object-cover"
              />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(character.status)}`}></span>
                  <h2 className="text-lg font-bold text-white truncate">{character.name}</h2>
                </div>
                <div className="space-y-1 text-sm text-gray-300">
                    
                  <p><span className="font-semibold">Status:</span> {character.status}</p>
                  <p><span className="font-semibold">Species:</span> {character.species}</p>
                  <p className="truncate"><span className="font-semibold">Location:</span> {character.location.name}</p>
                </div>
                <button
                  onClick={() => setSelectedCharacter(character)}
                  className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <PaginationControls />
        </div>
      </div>

      {selectedCharacter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">{selectedCharacter.name}</h2>
                <button
                  onClick={() => setSelectedCharacter(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  className="w-full md:w-1/2 rounded-lg"
                />
                
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Origin</h3>
                    <p>{selectedCharacter.origin.name}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Episodes</h3>
                    <p>Appeared in {selectedCharacter.episode.length} episodes</p>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {selectedCharacter.episode.map((ep) => {
                        const epNumber = ep.split('/').pop();
                        return (
                          <span
                            key={ep}
                            className="bg-gray-700 px-2 py-1 rounded text-sm text-center"
                          >
                            {epNumber}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}