import { useLoaderData } from "react-router-dom";

export default function Account() {
  const ids = useLoaderData();
  console.log(ids);

  return <div>Account page</div>;
}
