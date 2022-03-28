import { Link as PolarisLink } from "@shopify/polaris";
import Link from "next/link";

export default function About() {
  return (
    <div className="flex flex-col justify-center">
      <div className="text-3xl font-semibold text-center">About Page</div>
      <Link href="/" passHref as={<PolarisLink />}>
        <div className="text-center text-blue-500 cursor-pointer hover:underline">
          Go Back
        </div>
      </Link>
    </div>
  );
}
