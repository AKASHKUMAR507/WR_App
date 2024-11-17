import { Image, StyleSheet, View } from "react-native";
import colors from "../styles/colors";

const Icons = {
    Thumbs: 'thumbs',
    Initials: 'initials',
    Rings: 'rings',
    Shapes: 'shapes',
    Icons: 'icons'
}

function AvatarPlaceholder({ style = {}, image, icon = Icons.Thumbs, seed }) {
    const url = image ? image : { uri: `https://api.dicebear.com/6.x/${icon}/png?seed=${seed}` };

    return (
        <Image source={url} style={[styles.avatarPlaceholder, { ...style }]} />
    )
}

const styles = StyleSheet.create({
    avatarPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',

        width: 48,
        height: 48,

        borderRadius: 24,

        backgroundColor: colors.DarkGray20,
    },
});

export default AvatarPlaceholder;
export { Icons }