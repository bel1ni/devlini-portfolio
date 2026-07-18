import { supabase } from "./client";
type News ={
    category:string
    impact:number
}

export async function getTrendingTopics() {
    const {data, error} = await supabase
        .from("agro_news")
        .select("category, impact")

    if (error || !data) {
        console.error("Erro ao buscar trending: ", error?.message)
        return[]
    }

    const trendMap = new Map<string,number>()

    data.forEach((item: News)=>{
        const currentScore = trendMap.get(item.category) ?? 0 
        trendMap.set(item.category,currentScore + item.impact)
    })

    return Array.from(trendMap.entries()).map(([title, score])=> ({title, score,})).sort((a,b)=>b.score - a.score).slice(0,4)
}