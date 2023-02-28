import React from 'react';
import './HeaderBar.css'
import DigitalDisplay from "../../common/ui/DigitalDisplay/DigitalDisplay";
import Smile from "../../common/ui/Smile/Smile";
import GameStatusSchema from "../../schemas/gameStatus.schema";
import SmileStateSchema from "../../schemas/smileState.schema";

interface props {
    timer: number,
    status: GameStatusSchema,
    bombsLeft: number,
    onSmileClick(): void
}

const HeaderBar = ({bombsLeft, status, timer, onSmileClick}: props) => {
    let smileState: SmileStateSchema = 'default'
    switch (status) {
        case "scared":
            smileState = 'scary'
            break
        case "ended":
            smileState = 'dead'
            break
        case "won":
            smileState = 'cool'
            break
    }
    return (
        <div className={'header-bar bordered pushed'}>
            <DigitalDisplay number={bombsLeft}/>
            <Smile onClick={onSmileClick} state={smileState}/>
            <DigitalDisplay number={timer}/>
        </div>
    );
};

export default HeaderBar;