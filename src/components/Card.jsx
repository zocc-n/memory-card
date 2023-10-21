const Card = ({name, source}) => {

    return (
        <>
            <div>
                <div>
                    <img src={source} alt={name} />
                </div>
                <span>{name}</span>
            </div>
        </>
    )
}

export default Card