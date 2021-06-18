export default MaterialUI.makeStyles((theme) => {
	return {
		root: {
			overflowY: 'scroll',
			height: 'calc(100% - 60px)',
			'& p': {
				marginBottom: theme.spacing(2),
			}
		},
		header: {
			textAlign: 'center',
			padding: theme.spacing(2, 0)
		}
	}
})