export default function StructuredData() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "AgentX",
        "operatingSystem": "Web",
        "applicationCategory": "ProductivityApplication",
        "description": "Premium AI Blog Generation Agent and Research Engine. Optimized for SEO, AEO, and GEO.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Real-time web research",
            "AI Image Synthesis",
            "SEO Auto-optimization",
            "Advanced Agentic Workflows"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
