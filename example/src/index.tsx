import React, { useEffect, useMemo, useRef, useState } from 'light-react';

const test1 = () => {
    React.render(
        <div style="color: red" class="class-a">
            test
            <div style="color: red" class="class-a">
                test2
            </div>
        </div>,
        document.getElementById("root"),
    );

    setTimeout(() => {
        React.render(
            <div style="color: blue">
                test114514
            </div>,
            document.getElementById("root"),
        )
    }, 1000);
}

const test2 = () => {
    React.render(
        <div style="color: blue">
            test114514
        </div>,
        document.getElementById("root"),
    );

    setTimeout(() => {
        React.render(
            <div style="color: red" class="class-a">
                test
                <div style="color: red" class="class-a">
                    test2
                </div>
            </div>,
            document.getElementById("root"),
        )
    }, 1000);
}

const test3 = () => {
    function Comp({ text }: { text: string }) {
        return (
            <div>{text}</div>
        )
    }

    React.render(
        <Comp text={"114514"}/>,
        document.getElementById("root"),
    );
}

const test4Nested = () => {
    function Comp({ text }: { text: string }) {
        return (
            <Nested text={text}/>
        )
    }

    function Nested({ text }: { text: string }) {
        return (
            <div>{text}</div>
        )
    }


    React.render(
        <Comp text={"114514114514 nested"}/>,
        document.getElementById("root"),
    );
}

const test5ManyNested = () => {
    function Comp({ text }: { text: string }) {
        return (
            <div>
                <Nested text={text}/>
                <Nested text={text}/>
                <Nested text={text}/>
                <Nested text={text}/>
            </div>
        )
    }

    function Nested({ text }: { text: string }) {
        return (
            <div>{text}</div>
        )
    }


    React.render(
        <Comp text={"114514114514 nested"}/>,
        document.getElementById("root"),
    );
}

const test5Example = () => {
    function Comp({ text, intro }: { text: string, intro: string }) {
        return (
            <div>
                <h3>{text}</h3>
                <p>{intro}</p>
            </div>
        )
    }

    React.render(
        <Comp text={"Light React Sample"} intro={"Understand react by building it. "}/>,
        document.getElementById("root"),
    );
}

const test6ExampleRerender = () => {
    function Comp({ text, intro }: { text: string, intro: string }) {
        return (
            <div>
                <h3>{text}</h3>
                <p>{intro}</p>
            </div>
        )
    }

    React.render(
        <Comp text={"Light React Sample"} intro={"Understand react by building it. "}/>,
        document.getElementById("root"),
    );

    setTimeout(() => {
        React.render(
            <Comp text="fuckfuckfuck" intro="should rerender..." />,
            document.getElementById("root"),
        );
    }, 1000);
}

const test7ExampleUseState = () => {
    function Comp() {
        const [text, setText] = useState("initial");

        console.log("rendered");

        // @ts-ignore
        window.clickComp = () => { 
            console.log("clicked");
            setText("clicked")
        }

        return (
            <div onclick={"clickComp();"}>
                <h3>{text}</h3>
            </div>
        )
    }


    React.render(
        <Comp />,
        document.getElementById("root"),
    );
}

const test8ExampleUseState = () => {

    function Nested({ answer }: any) {
        return <h1>Answer is {answer}</h1>;
    }

    function Comp() {
        const [count, setCount] = useState(0);

        // @ts-ignore
        window.clickComp = () => { 
            setCount(count + 1)
        }

        return (
            <div onclick={"clickComp();"}>
                <Nested answer="42"/>
                <h3>You clicked {`${count}`} times</h3>
            </div>
        )
    }


    React.render(
        <Comp />,
        document.getElementById("root"),
    );
}

const test9ExampleUseState = () => {
    console.log("test9ExampleUseState", document.getElementById("root"))

    function Nested({ answer }: any) {
        return <h1>Answer is {answer}</h1>;
    }

    function Comp() {
        const [count, setCount] = useState(0);

        // @ts-ignore
        window.clickComp = () => { 
            setCount(count => count + 1)
        }

        return (
            <div onclick={"clickComp();"}>
                <Nested answer="42"/>
                <h3>You clicked {`${count}`} times</h3>
            </div>
        )
    }


    React.render(
        <Comp />,
        document.getElementById("root"),
    );
}

const test10ExampleUseRef = () => {
    function Comp() {
        const [counter, setCounter] = useState(0);
        const lastRender = useRef(new Date);

        console.log("rendered");

        // @ts-ignore
        window.clickComp = () => { 
            console.log("clicked");
            setCounter(counter => counter + 1)
        } 

        const elapsed = new Date().getTime() - lastRender.current.getTime();

        lastRender.current = new Date();

        return (
            <div onclick={"clickComp();"}>
                <h3>Clicked {counter}</h3>
                <p>Last render: {`${elapsed}`}ms ago</p>
            </div>
        )
    }

    React.render(
        <Comp />,
        document.getElementById("root"),
    );
}

const test10ExampleUseEffect = () => {
    function Comp() {
        const [data, setData] = useState(0);

        useEffect(() => {
            setTimeout(() => {
                setData(data + 1);
            }, 500);
        }, [data]);

        return (
            <p>
               This should update every 500ms: {data}
            </p>
        )
    }

    React.render(
        <Comp />,
        document.getElementById("root"),
    );
}

const test11ExampleUseMemo = () => {

    let lastMemo: any = {};

    function Comp() {
        const [data, setData] = useState(0);

        useEffect(() => {
            setTimeout(() => {
                setData(data + 1);
            }, 500);
        }, [data]);

        const memo = useMemo(() => ({ data: Math.floor(data / 3) }), [Math.floor(data / 3)]);
        const equal = memo === lastMemo;
        lastMemo = memo;

        return (
            <p>
               This should update every 500ms: {data} <br/>
               memo is {JSON.stringify(memo)} <br/>
               memo {equal ? "===" : "!=="} lastMemo <br/>
            </p>
        )
    }

    React.render(
        <Comp />,
        document.getElementById("root"),
    );
}



test11ExampleUseMemo();