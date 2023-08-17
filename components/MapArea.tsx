import React from "react"
import {GoogleMap, useJsApiLoader, Marker} from "@react-google-maps/api"
import Data from "../public/data.json"
import env from "../env-config"

interface MatsuriProp {
  id: number,
  location: string,// 開催場所
  price: string,// 料金
  phoneNumberMain: string,// 電話番号（メイン）
  phoneNumberSub: string | null,// 電話番号（サブ）
  address: string,// 住所
  trafficAccess: string,// 交通アクセス
  parkingLot: string,// 駐車場
  category: string,// カテゴリ
  officialSite: string,// 公式サイト
  holdingTime: string | null,// 開催時間
  reserved: string | null,// 予約
  forStormyWeather: string | null,// 荒天の場合
  ageLimit: string | null,// 年齢制限
  nearStation: string | null,// 駅近（最寄り駅から徒歩10分以内）
  startAt: string,// 開始日
  endAt: string,// 終了日
  remarks: string,// 備考
  formatted_address: string,// 座標Address
  geometry: google.maps.LatLngLiteral// 座標
}

const MapArea = () => {
  let centers: google.maps.LatLngLiteral[] = [{lat: 35.6992405, lng: 139.7698121}]
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: env.MAP_API_KEY,
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map: any) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(centers[0]);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  let matsuriInfos: MatsuriProp[] = []
  for (const i of Object.keys(Data.開催場所).map(str => Number(str))) {
    //console.log(i)
    let matsuri: MatsuriProp = {
      id: i,
      location: Data["開催場所"][i],                
      price: Data["料金"][i],
      phoneNumberMain: Data["電話番号（メイン）"][i],
      phoneNumberSub: Data["電話番号（サブ）"][i],
      address: Data["住所"][i],
      trafficAccess: Data["交通アクセス"][i],
      parkingLot: Data["駐車場"][i],
      category: Data["カテゴリ"][i],
      officialSite: Data["公式サイト"][i],
      holdingTime: Data["開催時間"][i],
      reserved: Data["予約"][i],
      forStormyWeather: Data["荒天の場合"][i],
      ageLimit: Data["年齢制限"][i],
      nearStation: Data["駅近（最寄り駅から徒歩10分以内）"][i],
      startAt: Data["開始日"][i],
      endAt: Data["終了日"][i],
      remarks: Data["備考"][i],
      formatted_address: Data["座標"][i][0].formatted_address,
      geometry: Data["座標"][i][0].geometry.location
    }
    matsuriInfos.push(matsuri)
  }
  return isLoaded ? (
    <div className="flex justify-center">
      <GoogleMap
        mapContainerStyle={{
          objectFit: "contain",
          width: "400px",
          height: "300px",
        }}
        center={centers[0]}
        zoom={9}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {matsuriInfos.map((mark, index) => (
          <Marker key={index} position={mark.geometry} label={`${mark.location}`} />
        ))}
      </GoogleMap>
      <div className="w-80 overflow-scroll h-screen underline-offset-0">
        {matsuriInfos.map(el => (
        <div className="flex text-white no-underline w-80">
          <div className="bg-gray-700 rounded-lg p-2 m-4 w-80">
            {/*<pre>{JSON.stringify(matsuriInfos, null, 2)}</pre>*/}
            {/* card top */}
            <div>
              {/* picture area */}
              <div></div>
              {/* top content */}
              <div>
              </div>
            </div>
            {/* card detail */}
            <div className="flex flex-col gap-2">
              {/* detail content */}
              <div className="flex flex-col gap-1">
                {/* content top */}
                <div className="text-xs text-yellow-400 border-yellow-400 border w-16 text-center rounded-lg">{el.parkingLot.includes("なし") ? `駐車場なし` : `駐車場あり`}</div>
                <div className="text-xs">{el.category}</div>
                <div className="text-purple-500 text-xs">{el.location}</div>
                <div className="text-xs">
                  {el.holdingTime}
                </div>
                {/* content */}
                <div>
                  <div className="text-xs">
                    {el.phoneNumberMain}
                  </div>
                </div>
                <div className="text-xs">
                  {el.reserved}
                </div>
                <div className="rounded-md p-2 bg-gray-500 text-xs text-gray-300"> {el.remarks} </div>
              </div>
              {/* detail bottom */}
              <div>
                <div className="flex justify-around">
                  <button type="button" className="bg-blue-500 px-3 py-1 rounded-xl text-xs">🔍 ルート</button>
                  <button type="button" className="text-blue-500 px-3 py-1 rounded-xl text-xs border border-gray-500">🔍 詳細</button>
                  <button type="button" className="text-blue-500 px-3 py-1 rounded-xl text-xs border border-gray-500"> 共有</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        ))}

      </div>
    </div>
  ) : (<></>)
}

export default MapArea
