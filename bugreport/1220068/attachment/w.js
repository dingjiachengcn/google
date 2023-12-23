class custom_proc extends AudioWorkletProcessor
{
	constructor()
	{
		super();
	}

	process(inputs, outputs, parameters)
	{
    return true;
  }
}

registerProcessor('p1',  custom_proc);
registerProcessor('p2',  custom_proc);

