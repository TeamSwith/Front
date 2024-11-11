import React, { useState, useEffect, useRef } from 'react';
import searchIcon from "../assets/search.png";

const MapDropdown = ({ onSelectLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedPlaceName, setSelectedPlaceName] = useState("");
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const { kakao } = window;

  // 좌표를 주소로 변환
  const fetchAddress = (latlng) => {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        setAddress(result[0].address.address_name);
      }
    });
  };

  useEffect(() => {
    const { kakao } = window;

    // 지도 생성
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 기본 위치 setting
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
    mapRef.current = map;
    const marker = new kakao.maps.Marker({ position: map.getCenter(), map });
    markerRef.current = marker;

    // 지도 클릭 시
    const handleMapClick = (mouseEvent) => {
        const latlng = mouseEvent.latLng;
        marker.setPosition(latlng);
        setSelectedLocation({ lat: latlng.getLat(), lng: latlng.getLng() });
        fetchAddress(latlng);
      };
  
      kakao.maps.event.addListener(map, 'click', handleMapClick);
  
      return () => kakao.maps.event.removeListener(map, 'click', handleMapClick);
    }, [onSelectLocation]);

    // 장소 검색
    const searchPlaces = () => {
        const ps = new kakao.maps.services.Places();
    
        if (!query.trim()) return;
    
        ps.keywordSearch(query, (data, status) => {
          if (status === kakao.maps.services.Status.OK) {
            setPlaces(data);
          }
        });
      };


    // 장소 목록에서 선택 시 해당 위치로 지도 이동 및 주소 설정
    const handlePlaceClick = (place) => {
    const position = new kakao.maps.LatLng(place.y, place.x);
    mapRef.current.setCenter(position);
    markerRef.current.setPosition(position);
    setSelectedLocation({ lat: place.y, lng: place.x });
    setSelectedPlaceName(place.place_name)
    fetchAddress(position);
    setSearchResults([]); // 목록 닫기
  };

    const handlePlaceSelection = () => {
        onSelectLocation(selectedLocation, selectedPlaceName, address); // 주소 및 키워드 전달
  };

  return (
    <div className="absolute top-full mt-2 bg-white shadow-lg rounded-lg p-4 z-10 w-[350px] h-[500px] relative">
      <div className="flex justify-between items-center mb-2">
        <input
          type="text"
          placeholder="스터디 장소를 입력하세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 mb-1 border border-gray-300 rounded-xl"
        />
        <img src={searchIcon} alt="location search" onClick={() => searchPlaces()} className="w-6 h-6 ml-2 cursor-pointer" />
      </div>

      {/* 검색 결과 목록 */}
        <ul className="bg-white bg-opacity-70 border border-gray-300 rounded-lg max-h-40 w-[290px] overflow-y-auto absolute w-full mt-1 z-20 shadow-lg">
          {places.map((place, index) => (
            <li
              key={index}
              onClick={() => handlePlaceClick(place)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {place.place_name}
            </li>
          ))}
        </ul>

      <div id="map" className="w-full h-[300px] mb-4"></div>
      <p className="text-gray-600 text-[15px] mb-2">
        선택된 주소: {address ? `${address} ${selectedPlaceName}` : ""}
      </p>

      <button onClick={handlePlaceSelection} className="bg-[#8CC29E] text-white px-4 py-2 rounded w-full absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[320px]">
        스터디 장소로 지정
      </button>
    </div>
  );
};

export default MapDropdown;