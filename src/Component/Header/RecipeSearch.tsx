import { useState } from "react";
import SearchBar from "../../styled/SearchBar";
import inputRecipeKeyword from "../Fn/InputRecipe_Keyword copy";
import inputRecipeCocktailName from "../Fn/InputRecipe_CocktailName";
import setAutoWordText from "../Fn/SetAutoWordText";
import searchRecipeKeyword from "../Fn/SearchRecipe_Keyword";
import { Recipe } from "../Fn/Interface/Recipe";
import recipeLoad from "../Fn/RecipeLoad";
import searchRecipeCocktailName from "../Fn/SearchRecipe_Cocktail";

const RecipeSearch = () => {
    let [getkeyword, setkeyword] = useState<string[]>([]);
    let [getautoword, setautoword] = useState<string[]>([]);
    let [getcategory, setcategory] = useState<string>("ingredient");
    let [gettextvalue,settextvalue] = useState<string>("");
    let [getrecipes, setrecipes] = useState<Promise<Recipe[]> | Recipe[]>(recipeLoad());
    return (
        <SearchBar>
            <header id="RecipeLogo">
                RECIPE
            </header>
            <section id="format">
                <select id="category" onChange={(e) => {
                    console.log(e.currentTarget.value);
                    setkeyword([]);
                    setcategory(e.currentTarget.value);
                }}>
                    <option value="ingredient">재료</option>
                    <option value="name">이름</option>
                </select>
                <article id="input_area">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    {getkeyword.map((word) => {
                        return (
                            <div key={word} className="keyword"
                            onClick={() => {
                                setkeyword((words) => 
                                words.filter((w) => w !== word))
                            }}>{word}</div>
                        )
                    })}
                    {getcategory === "ingredient" ? 
                    <input type="text" id="input" placeholder="재료를 입력해보세요"
                    onChange={async (e) => {
                        settextvalue(e.currentTarget.value);
                        setautoword(await inputRecipeKeyword(e.currentTarget.value));
                    }}/> :
                    <input type="text" id="input" placeholder="이름을 입력해보세요"
                    onChange={async (e) => {
                        settextvalue(e.currentTarget.value);
                        setautoword(await inputRecipeCocktailName(e.currentTarget.value));
                    }}/>
                    }
                </article>
                <article id="submit_area">
                    <input type="submit" value="Search" id="submit"
                    onClick={
                        async (e) => {
                            e.preventDefault();
                            if(getcategory === "name"){
                                const recipes = await getrecipes;
                                const result = searchRecipeCocktailName(recipes, gettextvalue);
                                console.log(result);
                                setrecipes(result);
                            }
                            else{
                                const recipes = await getrecipes;
                                const result = searchRecipeKeyword(recipes, getkeyword);
                                let _recipes:Recipe[] = [];
                                result[0].forEach((r) => {
                                    _recipes.push(r);
                                });
                                result[1].forEach((r) => {
                                    _recipes.push(r);
                                })
                                //console.log(result);
                                console.log(_recipes);
                                setrecipes(_recipes);
                            }
                        }
                    }/>
                </article>
                {getautoword.length === 0? <></>:
                    <article id="autoword">
                        {getautoword.map((s) => {
                            const result = setAutoWordText(s, gettextvalue);
                            return (
                                <nav key={s} className="nav"
                                onClick={async () => {
                                    let is_ok = true;
                                    if (getcategory === "name"){
                                        const recipes = await getrecipes;
                                        const result = searchRecipeCocktailName(recipes, s);
                                        console.log(result);
                                        setrecipes(result);
                                        return;
                                    }
                                    getkeyword.forEach((k)=>{
                                        if(s === k){
                                            is_ok = false;
                                            return false;
                                        }
                                    });
                                    if(is_ok){
                                        const word = getkeyword;
                                        word.push(s);
                                        setkeyword(()=>word);
                                        const inputEle = document.getElementById("input") as HTMLInputElement;
                                        inputEle.value = "";
                                        settextvalue("");
                                        setautoword([]);
                                    }
                                }}>
                                    {result}
                                </nav>
                            )
                        })}
                    </article>
                }
            </section>
        </SearchBar>
    )
}

export default RecipeSearch;