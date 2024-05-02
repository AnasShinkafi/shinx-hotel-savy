import { getHotels } from "../../actions/getHotels";

interface Props {
  searchParams: {
    title: string,
    country: string,
    state: string,
    city: string,
  }
}

export default async function Home({searchParams}: Props) {
  
  const hotels = await getHotels(searchParams);
  if(!hotels) return <div className="">No Hotels Found.....</div>
  return (
    <div className="">Home</div>
  );
}
