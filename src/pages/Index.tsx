const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white font-mono p-8">
      <div className="max-w-2xl w-full space-y-4">
        <div className="text-red-500 text-sm">
          <p className="text-red-400 mb-6 text-xs opacity-70">GNU/Linux x86_64</p>
          <p className="mb-1 text-red-500">KERNEL PANIC - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)</p>
          <p className="text-gray-500 text-xs mb-4">---[ end Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0) ]---</p>
          
          <div className="text-gray-400 text-xs space-y-0.5 mb-6">
            <p>CPU: 0 PID: 1 Comm: swapper/0 Not tainted 5.15.0-generic #1</p>
            <p>Hardware name: QEMU Standard PC (i440FX + PIIX, 1996)</p>
            <p>Call Trace:</p>
            <p className="pl-4">{"<TASK>"}</p>
            <p className="pl-6">dump_stack_lvl+0x34/0x44</p>
            <p className="pl-6">panic+0x102/0x2b4</p>
            <p className="pl-6">mount_block_root+0x1d2/0x2b8</p>
            <p className="pl-6">prepare_namespace+0x136/0x165</p>
            <p className="pl-6">kernel_init_freeable+0x222/0x238</p>
            <p className="pl-6">kernel_init+0x16/0x120</p>
            <p className="pl-6">ret_from_fork+0x22/0x30</p>
            <p className="pl-4">{"</TASK>"}</p>
          </div>

          <div className="text-gray-500 text-xs space-y-0.5">
            <p>[ 3.241502] List of all partitions:</p>
            <p>[ 3.241504] No filesystem could mount root, tried:</p>
            <p>[ 3.241505] &nbsp;&nbsp;ext3 ext2 ext4 vfat msdos iso9660 fuseblk</p>
            <p className="mt-2 text-red-400 animate-pulse">[ 3.241510] Kernel Offset: disabled</p>
            <p className="text-red-400">[ 3.241511] ---[ end Kernel panic ]---</p>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-4">
            <p className="text-gray-600 text-xs">System halted.</p>
            <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
