import { COLORS, FONT_SIZE } from "../../constants/theme"

export const styles = {
    container: {
        flex: 1,
        padding: 40,
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        color: "#3A8DCC",
        fontSize: 30,
        fontWeight: "700",
        marginBottom: 18,
        letterSpacing: 0.4
    },
    form: {
        width: "100%",
        marginBottom: 25
    },
    formGroup: {
        width: "100%",
        marginTop: 50,
        marginBottom: 40
    },
    footer: {
        width: "100%",
        position: "absolute",
        bottom: 0,
        marginBottom: 40
    },
    footerText: {
        textAlign: "center",
        color: COLORS.dark_gray,
        fontSize: FONT_SIZE.md
    }
}
