import React, { useEffect, useMemo, useRef, useState } from 'light-react';

function Child() {
    useEffect(() => {
        return () => {
            console.log("Child is unmounted...")
        }
    }, []);

    return (
        <p>child</p>
    )
}

function Comp() {
    const [counter, setCounter] = useState(0);
    const lastRender = useRef(new Date());
  
    console.log("rendered");
  
    // @ts-ignore
    window.clickComp = () => {
      console.log("clicked");
      setCounter((counter) => counter + 1);
    };
  
    const elapsed = new Date().getTime() - lastRender.current.getTime();
  
    lastRender.current = new Date();
  
    return (
      <div onclick={"clickComp();"}>
        <h3>Clicked {counter}</h3>
        <p>Last render: {`${elapsed}`}ms ago</p>
      </div>
    );
  }
  
  React.render(<Comp />, document.getElementById("root"));
  