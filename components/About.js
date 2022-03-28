import Link from "next/link";

export function About() {
  return (
    <div className="flex flex-col justify-center">
      <div className="text-3xl font-semibold text-center">About Page</div>
      <Link passHref href="/">
        <div className="text-center text-blue-500 cursor-pointer hover:underline">Go Back</div>
      </Link>
    </div>
  );
}
