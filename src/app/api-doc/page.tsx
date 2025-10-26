import { getApiDocs } from "@/src/lib/swagger";
import ReactSwagger from "./_components/react-swagger";

export default async function ApiDocPage() {
    const spec = await getApiDocs();
    return (
        <section className="container">
            <ReactSwagger spec={spec} />
        </section>
    );
}
