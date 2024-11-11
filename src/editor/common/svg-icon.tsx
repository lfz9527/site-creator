interface Props {
    name: string
    prefix?: string
    iconStyle?: React.CSSProperties
}

const SvgIcon: React.FC<Props> = (props) => {
    const {
        name,
        prefix = 'icon',
        iconStyle = {
            width: '50px',
            height: '50px'
        }
    } = props

    const width = iconStyle.width || '50px'
    const height = iconStyle.height || '50px'

    const symbolId = `#${prefix}-${name}`
    return (
        <svg
            aria-hidden='true'
            style={{
                ...iconStyle,
                width,
                height
            }}
        >
            <use href={symbolId} />
        </svg>
    )
}

export default SvgIcon
