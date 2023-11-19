import Avatar from '@mui/material/Avatar';

export function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringToName(name) {
    if (name.includes(' ')) {
        return name.split(' ')[0][0] + name.split(' ')[1][0]
    } else return name[0]+name[1];
}

function stringAvatar(name) {


    return {
        sx: {
            bgcolor: stringToColor(name),
            borderColor: 'red',
            borderWidth: '2px',
            ml: '-8px!important',
        },
        children: stringToName(name),
    };
}

export default function SkillFroupAvatar(props) {
    return (
        <Avatar sx={{borderColor:'GrayText', borderWidth:'2px', borderStyle:'solid'}} {...stringAvatar(props.name, props.group)} variant={props.variant}/>
    );
}