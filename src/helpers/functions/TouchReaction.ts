import positiveReaction from '../../graphics/creature_sprites/chocobo_sprites/chocobo-happy.gif';
import neutralReaction from '../../graphics/creature_sprites/chocobo_sprites/chocobo-thinking.gif';
import negativeReaction from '../../graphics/creature_sprites/chocobo_sprites/chocobo-headshake.gif';

export const touchReaction = (currentHappiness: number, ele: any, setCurrentlyBusy: React.Dispatch<React.SetStateAction<boolean>>) => {
    const isHappy = (currentHappiness >= 70);
    const isSad = (currentHappiness <= 30);
    setCurrentlyBusy(true);
    const ogSource = ele.target.src;
    
    ele.target.classList.add('no-touch');

    if (ele && ele.target && ele.target.src) {
        if (ele.target.classList.contains('egg')) {
            ele.target.classList.add('shake');
        } else if (isHappy) {
            ele.target.src = positiveReaction;
        } else if (isSad) {
            ele.target.src = negativeReaction;
        } else {
            ele.target.src = neutralReaction;
        }

        const waitToChangeBack = setTimeout(() => {
            ele.target.src = ogSource;
            ele.target.classList.remove('shake');
            ele.target.classList.remove('no-touch');
            setCurrentlyBusy(false);
        }, 2000);

        return () => clearTimeout(waitToChangeBack);
    }
}