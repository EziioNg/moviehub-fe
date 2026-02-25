import { notFound } from "next/navigation";
import CategoryClient from "./CategoryClient";

const CATEGORY_IDS: Record<string, string> = {
  adventure: "6874c84d346bbf62467bee89",
  action: "6874ca16346bbf62467bee98",
  "sci-fi": "6874c96d346bbf62467bee96",
  fantasy: "6874c98d346bbf62467bee97",
  xeno: "6874c95c346bbf62467bee95",
  featured: "686b74eb2b65be5c804297f2",
};

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = params.category;
  const categoryId = CATEGORY_IDS[category];

  if (!categoryId) {
    notFound();
  }

  return <CategoryClient category={category} categoryId={categoryId} />;
}
