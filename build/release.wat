(module
 (type $0 (func (param i32) (result i64)))
 (type $1 (func (param i32 i32) (result i64)))
 (type $2 (func (param i64 i32) (result i64)))
 (type $3 (func (param i32) (result i32)))
 (memory $0 4)
 (export "factorial" (func $assembly/index/factorial))
 (export "fibonacci" (func $assembly/index/fibonacci))
 (export "isPrime" (func $assembly/index/isPrime))
 (export "sumArray" (func $assembly/index/sumArray))
 (export "power" (func $assembly/index/power))
 (export "memory" (memory $0))
 (func $assembly/index/sumArray (param $0 i32) (param $1 i32) (result i64)
  (local $2 i32)
  (local $3 i64)
  loop $for-loop|0
   local.get $1
   local.get $2
   i32.gt_s
   if
    local.get $3
    local.get $0
    local.get $2
    i32.const 2
    i32.shl
    i32.add
    i64.load32_s
    i64.add
    local.set $3
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
  local.get $3
 )
 (func $assembly/index/power (param $0 i64) (param $1 i32) (result i64)
  (local $2 i64)
  (local $3 i32)
  i64.const 1
  local.set $2
  loop $for-loop|0
   local.get $1
   local.get $3
   i32.gt_s
   if
    local.get $0
    local.get $2
    i64.mul
    local.set $2
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $for-loop|0
   end
  end
  local.get $2
 )
 (func $assembly/index/fibonacci (param $0 i32) (result i64)
  (local $1 i64)
  (local $2 i64)
  (local $3 i64)
  (local $4 i32)
  local.get $0
  i32.const 1
  i32.le_s
  if
   local.get $0
   i64.extend_i32_s
   return
  end
  i64.const 1
  local.set $1
  i32.const 2
  local.set $4
  loop $for-loop|0
   local.get $0
   local.get $4
   i32.ge_s
   if
    local.get $1
    local.get $2
    i64.add
    local.get $1
    local.set $2
    local.set $1
    local.get $4
    i32.const 1
    i32.add
    local.set $4
    br $for-loop|0
   end
  end
  local.get $1
 )
 (func $assembly/index/factorial (param $0 i32) (result i64)
  (local $1 i32)
  (local $2 i64)
  i64.const 1
  local.set $2
  i32.const 2
  local.set $1
  loop $for-loop|0
   local.get $0
   local.get $1
   i32.ge_s
   if
    local.get $2
    local.get $1
    i64.extend_i32_s
    i64.mul
    local.set $2
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
  local.get $2
 )
 (func $assembly/index/isPrime (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  i32.const 2
  i32.lt_s
  if
   i32.const 0
   return
  end
  local.get $0
  i32.const 2
  i32.eq
  if
   i32.const 1
   return
  end
  local.get $0
  i32.const 1
  i32.and
  i32.eqz
  if
   i32.const 0
   return
  end
  i32.const 3
  local.set $1
  loop $while-continue|0
   local.get $1
   local.get $1
   i32.mul
   local.get $0
   i32.le_s
   if
    local.get $0
    local.get $1
    i32.rem_s
    i32.eqz
    if
     i32.const 0
     return
    end
    local.get $1
    i32.const 2
    i32.add
    local.set $1
    br $while-continue|0
   end
  end
  i32.const 1
 )
)
