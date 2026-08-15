import { PipMascot } from '../components/PipMascot'
import { LinkButton } from '../components/ui'
export default function NotFound() { return <section className="section empty-state"><PipMascot mood="confused" size={220}/><h1>Pip can’t find that page.</h1><p>Let’s head back to familiar ground.</p><LinkButton to="/">Go home</LinkButton></section> }
