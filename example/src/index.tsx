import React from 'light-react';

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

test5ManyNested();